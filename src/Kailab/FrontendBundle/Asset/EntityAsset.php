<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\Container;
use Doctrine\ORM\Proxy\Proxy;

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
        return $this->getAsset()->getResponse();
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
        if($this->state == self::STATE_ASSET && $this->asset instanceof AssetInterface){
            return $this->asset;
        }else if($this->state == self::STATE_PATH){
            return $this->getPathAsset();
        }else{
            throw new \RuntimeException('No path or asset loaded');
        }
        return null;
    }

    public function setAsset(AssetInterface $asset)
    {
        $this->asset = new ParameterAsset(array(
            'name'          => $this->getName(),
            'content'       => $asset->getContent(),
            'content_type'  => $asset->getContentType(),
        ));
        $this->state = self::STATE_ASSET;
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
        return $this->getAsset()->getContentType();
    }

    public function getContent()
    {
        return $this->getAsset()->getContent();
    }

    public function getName()
    {
        return $this->entity->getId().'_'.$this->property;
    }

    public function getNamespace()
    {
        // fixme! better namespaces...
        // take only last part of class name
        $class =  explode('\\',get_class($this->entity));
        $ns = Container::underscore(end($class));

        if($this->entity instanceof Proxy){
            // hack
            $ns = substr($ns,strpos($ns,'_entity_')+8,-6);
        }
        return $ns;
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
        $asset = $this->getAsset();
        $ns = $this->getNamespace();
        if(!$storage->writeAsset($asset,$ns)){
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
