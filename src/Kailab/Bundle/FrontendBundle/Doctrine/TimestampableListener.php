<?php

namespace Kailab\Bundle\FrontendBundle\Doctrine;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;

class TimestampableListener
{
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $em = $args->getEntityManager();
        $meta = $em->getClassMetadata(get_class($entity));
        $id = $meta->getIdentifierValues($entity);
        $now = new \DateTime('now');
        if(method_exists($entity,'setUpdated')){
            $entity->setUpdated($now);
        }
        if(!$id && method_exists($entity,'setCreated')){
            $entity->setCreated($now);
        }
    }
}
