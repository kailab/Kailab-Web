<?php

namespace Kailab\Bundle\BackendBundle\Templating\Helper;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Locale\Locale;

class BackendHelper extends Helper
{
    private $container;
    private $config;

    public function __construct(ContainerInterface $container, array $config=array())
    {
        $this->container = $container;
        $this->config = $config;
    }

    public function getName()
    {
        return 'backend';
    }

    public function user()
    {
        return $this->container->get('security.context')->getToken()->getUser();
    }

}
