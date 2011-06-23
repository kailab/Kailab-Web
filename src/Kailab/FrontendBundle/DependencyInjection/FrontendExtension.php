<?php

namespace Kailab\FrontendBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class FrontendExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $config = reset($configs);

        $container
            ->register('templating.helper.frontend', 'Kailab\FrontendBundle\Templating\Helper\FrontendHelper')
            ->setArguments(array(new Reference('service_container'),$config))->addTag('templating.helper');

        $container
            ->register('twig.extension.frontend', 'Kailab\FrontendBundle\Templating\Twig\Extension\HelperExtension')
            ->addArgument(new Reference('templating.helper.frontend'))->addTag('twig.extension');

        $container
            ->register('templating.helper.screenshot', 'Kailab\FrontendBundle\Templating\Helper\ScreenshotHelper')
            ->setArguments(array(new Reference('service_container'),$config))->addTag('templating.helper');

        $container
            ->register('twig.extension.screenshot', 'Kailab\FrontendBundle\Templating\Twig\Extension\HelperExtension')
            ->addArgument(new Reference('templating.helper.screenshot'))->addTag('twig.extension');

        $container
            ->register('templating.helper.locale', 'Kailab\FrontendBundle\Templating\Helper\LocaleHelper')
            ->setArguments(array(new Reference('service_container'),$config))->addTag('templating.helper');

        $container
            ->register('twig.extension.locale', 'Kailab\FrontendBundle\Templating\Twig\Extension\HelperExtension')
            ->addArgument(new Reference('templating.helper.locale'))->addTag('twig.extension');

        $container
            ->register('doctrine.listener.i18n', 'Kailab\FrontendBundle\Doctrine\I18nListener')
            ->addArgument(new Reference('service_container'))
            ->addTag('doctrine.event_listener', array('event'=>'postLoad'));

        $container
            ->register('doctrine.listener.position', 'Kailab\FrontendBundle\Doctrine\PositionListener')
            ->addArgument(new Reference('service_container'))
            ->addTag('doctrine.event_listener', array('event'=>'prePersist'));

        $container
            ->register('doctrine.listener.timestampable', 'Kailab\FrontendBundle\Doctrine\TimestampableListener')
            ->addArgument(new Reference('service_container'))
            ->addTag('doctrine.event_listener', array('event'=>'prePersist'));

        $container
            ->register('doctrine.asset.storage', 'Kailab\FrontendBundle\Asset\DirectoryAssetStorage')
            ->addArgument(new Reference('service_container'));

        $container
            ->register('doctrine.listener.asset', 'Kailab\FrontendBundle\Doctrine\AssetListener')
            ->addArgument(new Reference('service_container'))
            ->addTag('doctrine.event_listener', array('event'=>'postPersist'))
            ->addTag('doctrine.event_listener', array('event'=>'postUpdate'))
            ->addTag('doctrine.event_listener', array('event'=>'postRemove'))
            ->addTag('doctrine.event_listener', array('event'=>'postLoad'));
    }

    public function getXsdValidationBasePath()
    {
        return __DIR__.'/../Resources/config/';
    }

    public function getNamespace()
    {
        return 'kailab_frontend';
    }
}
