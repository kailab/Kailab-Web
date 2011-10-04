<?php

namespace Kailab\Bundle\SharedBundle\Doctrine;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;
use Assetic\AssetWriter;
use Kailab\Bundle\SharedBundle\Asset\AssetReader;

class AssetListener
{
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function postLoad(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();
        $this->updateEntityAssets($entity,$em,'load');
    }

    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();
        $this->updateEntityAssets($entity,$em,'save');
    }

    public function postUpdate(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();
        $this->updateEntityAssets($entity,$em,'save');
    }

    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();
        $this->updateEntityAssets($entity,$em,'delete');
    }

    protected function getEntityAssets($entity)
    {
        $method = 'getAssets';
        if(!method_exists($entity,$method)){
            return array();
        }
        $assets = $entity->$method();
        if(!is_array($assets)){
            $assets = array($assets);
        }
        return $assets;
    }

    protected function updateEntityAssets($entity,$em,$action='save')
    {
        $assets = $this->getEntityAssets($entity);
        $storage = $this->container->get('doctrine.asset.storage');

        $method = 'updateAssets';
        if($action == 'save' && method_exists($entity, $method)){
        	$entity->$method();
        }
        
        foreach($assets as $asset){
            if(!$asset instanceof EntityAsset){
                continue;
            }
            try{
                switch($action){
                    case 'save':
                        $asset->save($storage);
                        break;
                    case 'delete':
                        $asset->delete($storage);
                        break;
                    case 'load':
                        $asset->load($storage);
                        break;
                }
            }catch(\Exception $e){
            }
        }
    }
}
