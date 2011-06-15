<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\Container;

class EntityAsset extends File implements AssetInterface
{
    const STATE_NONE = 0;
    const STATE_ASSET = 1;
    const STATE_PATH = 2;

    protected $state;
    protected $entity;
    protected $asset;
    protected $property;

    public function __construct($entity, $property, $path=null)
    {
        $this->entity = $entity;
        $this->property = $property;
        $this->path = $path;
        $this->state = self::STATE_NONE;
    }

    public function __toString()
    {
        return (string) $this->getId();
    }

    public function getId()
    {
        return $this->getNamespace().'/'.$this->getName();
    }

    public function getResponse()
    {
        $response = new Response();
        $response->setContent($this->getContent());
        $response->headers->set('Content-Type',$this->getContentType());
        return $response;
    }

    public function getPath()
    {
        if($this->state == self::STATE_PATH){
            return $this->path;
        }
        if($this->asset instanceof FileAsset){
            return $this->asset->getPath();
        }else if($this->asset instanceof AssetInterface){
            $tmp = tempnam(sys_get_temp_dir(),'');
            if(@file_put_contents($path,$asset->getContent())){
                return $tmp;
            }
        }
        return null;
    }

    public function getFile()
    {
        $path = $this->getPath();
        if($path){
            return new File($path);
        }
    }

    public function setState($state)
    {
        $this->state = $state;
    }

    public function getState()
    {
        return $this->state;
    }

    public function loadPath($path)
    {
        if($this->path != $path){
            $this->state = self::STATE_PATH;
            $this->path = $path;
        }
    }

    public function getAsset()
    {
        if($this->asset instanceof AssetInterface){
            return $this->asset;
        }else if($this->state == self::STATE_PATH){
            return $this->getPathAsset();
        }
        return null;
    }

    public function getPathAsset()
    {
        if(!is_readable($this->path)){
            throw new \RuntimeException('Could not read path '.$this->path);
        }
        return new FileAsset($this->path, $this->getName());
    }

    public function getContentType()
    {
        if($this->state == self::STATE_PATH){
            return $this->getPathAsset()->getContentType();
        }else if($this->state == self::STATE_ASSET){
            return $this->getAsset()->getContentType();
        }else{
            throw new \RuntimeException('No path or asset loaded');
        }
    }

    public function getContent()
    {
        if($this->state == self::STATE_PATH){
            return $this->getPathAsset()->getContent();
        }else if($this->state == self::STATE_ASSET){
            return $this->getAsset()->getContent();
        }else{
            throw new \RuntimeException('No path or asset loaded');
        }
    }

    public function getName()
    {
        return $this->entity->getId().'_'.$this->property;
    }

    public function getNamespace()
    {
        // take only last part of class name
        $class =  explode('\\',get_class($this->entity));
        return Container::underscore(end($class));
    }

    public function load(AssetStorageInterface $storage)
    {
        $ns = $this->getNamespace();
        $this->asset = $storage->readAsset($this->getName(),$ns);
        if(!$this->asset instanceof AssetInterface){
            return false;
        }
        $this->state = self::STATE_ASSET;
        return true;
    }

    public function save(AssetStorageInterface $storage)
    {
        if($this->state != self::STATE_PATH){
            return false;
        }
        $ns = $this->getNamespace();
        $asset = $this->getPathAsset();
        if($storage->writeAsset($asset,$ns)){
            return false;
        }
        return true;
    }

    public function delete(AssetStorageInterface $storage)
    {
        if($this->state != self::STATE_ASSET){
            return false;
        }
        $class = get_class($this->entity);
        $asset = $this->getAsset();
        $ns = $this->getNamespace();
        if(!$storage->deleteAsset($asset->getName(),$ns)){
            return false;
        }
        return true;
    }

}
