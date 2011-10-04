<?php

namespace Kailab\Bundle\FrontendBundle\Doctrine;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;

class I18nListener
{
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function postLoad(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $locale = $this->container->get('session')->getLocale();
        $method = 'setCurrentLocale';
        if(method_exists($entity,$method)){
            $entity->$method($locale);
        }
    }

}
