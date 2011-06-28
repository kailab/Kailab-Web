<?php

namespace Kailab\BackendBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class BackendExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $config = reset($configs);
        $container
            ->register('templating.helper.backend', 'Kailab\BackendBundle\Templating\Helper\BackendHelper')
            ->setArguments(array(new Reference('service_container'),$config))
            ->addTag('templating.helper');

        $container
            ->register('twig.extension.backend', 'Kailab\FrontendBundle\Templating\Twig\Extension\HelperExtension')
            ->addArgument(new Reference('templating.helper.backend'))
            ->addTag('twig.extension');
    }

    public function getXsdValidationBasePath()
    {
        return __DIR__.'/../Resources/config/';
    }

    public function getNamespace()
    {
        return 'kailab_backend';
    }
}
