<?php

namespace Kailab\Bundle\SharedBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\Container;
use Doctrine\ORM\Proxy\Proxy;

class EntityAsset extends File implements PublicAssetInterface
{
    protected $entity;
    protected $asset;
    protected $property;

    public function __construct($entity, $property, $path=null)
    {
        $this->entity = $entity;
        $this->property = $property;
        $this->path = $path;
    }

    public function __toString()
    {
        return (string) $this->getId();
    }

    public function getId()
    {
        return $this->getNamespace().'/'.$this->getName();
    }

    public function getPath()
    {
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

    public function getUri()
    {
        $asset = $this->getAsset();
        if($asset instanceof PublicAssetInterface){
            return $asset->getUri();
        }
    }

    public function getAsset()
    {
    	return $this->asset;
    }

    public function setAsset($asset)
    {
        if($asset instanceof AssetInterface){
            $this->asset = new ParameterAsset(array(
                'name'          => $asset->getName(),
                'content'       => $asset->getContent(),
                'content_type'  => $asset->getContentType(),
            ));
        }else if($asset instanceof \SplFileInfo || is_string($asset)){
        	$this->asset = new FileAsset($asset);
        }
    }
    
    public function getResponse()
    {
    	$asset = $this->getAsset();
    	if($asset instanceof AssetInterface){
    		return call_user_func_array(array($asset,'getResponse'),
    		func_get_args());
    	}
    }

    public function getContentType()
    {
       	$asset = $this->getAsset();
    	if($asset instanceof AssetInterface){
    		return call_user_func_array(array($asset,'getContentType'),
    		func_get_args());
    	}
    }

    public function getContent()
    {
        $asset = $this->getAsset();
    	if($asset instanceof AssetInterface){
    		return call_user_func_array(array($asset,'getContent'),
    		func_get_args());
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
            // hack to get the entity name from the proxy
            $ns = substr($ns,strrpos($ns,'_entity_')+8,-6);
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
        return true;
    }

    public function save(AssetStorageInterface $storage)
    {
        $asset = $this->getAsset();
        if(!$asset instanceof AssetInterface){
            return false;
        }
		$name = $this->getName();
        $ns = $this->getNamespace();
        if(!$storage->writeAsset($asset,$ns,$name)){
            return false;
        }
        return true;
    }

    public function delete(AssetStorageInterface $storage)
    {
    	$asset = $this->getAsset();
    	if(!$asset instanceof AssetInterface){
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
