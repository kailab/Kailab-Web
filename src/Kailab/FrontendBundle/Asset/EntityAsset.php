<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\Container;
use Doctrine\ORM\Proxy\Proxy;

class EntityAsset extends File implements PublicAssetInterface
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

    public function serialize() {
        return serialize(array(
            'state'     => $this->state,
            'entity'    => $this->entity,
            'path'      => $this->path,
            'state'     => $this->state,
        ));
    }

    public function unserialize($data) {
        if(!is_array($data)){
            return;
        }
        if(isset($data['state'])){
            $this->state = $data['state'];
        }
        if(isset($data['entity'])){
            $this->entity = $data['entity'];
        }
        if(isset($data['path'])){
            $this->path = $data['path'];
        }
        if(isset($data['state'])){
            $this->state = $data['state'];
        }
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

    public function getUri()
    {
        $asset = $this->getAsset();
        if($asset instanceof PublicAssetInterface){
            return $asset->getUri();
        }
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
        }
        return null;
    }

    public function setAsset($asset)
    {
        if(is_string($asset) || $asset instanceof File){
            $this->loadPath($asset);
        }else if($asset instanceof AssetInterface){
            $this->asset = new ParameterAsset(array(
                'name'          => $asset->getName(),
                'content'       => $asset->getContent(),
                'content_type'  => $asset->getContentType(),
            ));
            $this->state = self::STATE_ASSET;
        }
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
        $asset =  $this->getAsset();
        if($asset instanceof AssetInterface){
            return $asset->getContentType();
        }
    }

    public function getContent()
    {
        $asset =  $this->getAsset();
        if($asset instanceof AssetInterface){
            return $asset->getContent();
        }
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
        if(!$asset instanceof AssetInterface){
            return false;
        }
        $asset = new ParameterAsset(array(
            'name'          => $this->getName(),
            'content'       => $asset->getContent(),
            'content_type'  => $asset->getContentType(),
        ));
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
