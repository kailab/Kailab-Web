<?php

namespace Kailab\Bundle\SharedBundle\Doctrine;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\NoResultException;

class PositionListener
{
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        if(!method_exists($entity,'setPosition')){
            return;
        }
        if(!method_exists($entity,'getPosition')){
            return;
        }
        $position = $entity->getPosition();
        if($position !== null){
            return;
        }
        $em = $args->getEntityManager();
        $repo = $em->getRepository(get_class($entity));

        $method = 'getLastPosition';
        if(method_exists($repo,$method)){
            try{
                $position = $repo->$method();
            }catch(\Exception $e){
                $position = 0;
            }
        }else{
            $builder = $repo->createQueryBuilder('p');
            $builder->add('orderBy', 'p.position DESC');
            $builder->setMaxResults(1);
            $query = $builder->getQuery();
            try{
                $last = $query->getSingleResult();
                $position = $last->getPosition() + 1;
            }catch(\Exception $e){
                $position = 0;
            }
        }
        $entity->setPosition($position);
    }
}
