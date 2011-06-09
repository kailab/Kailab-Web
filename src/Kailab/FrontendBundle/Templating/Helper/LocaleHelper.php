<?php

namespace Kailab\FrontendBundle\Templating\Helper;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Locale\Locale;

class LocaleHelper extends Helper
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
        return 'locale';
    }

    public function __toString()
    {
        return $this->code();
    }

    public function code()
    {
        return $this->container->get('session')->getLocale();
    }

    public function name($code)
    {
        $all = Locale::getDisplayLocales($code);
        $name = isset($all[$code]) ? $all[$code] : $code;
        return ucfirst($name);
    }

    public function path($locale)
    {
        $router = $this->container->get('router');
        $request = $this->container->get('request');
        $route = $request->attributes->get('_route');
        return $router->generate($route, array('_locale' => $locale));
    }

    public function locales()
    {
        $codes = array();
        if(isset($this->config['locales'])){
            $codes = $this->config['locales'];
        }
        if(!is_array($codes)){
            $codes = array($codes);
        }
        $list = array();
        foreach($codes as $code){
            $list[$code] = $this->name($code);
        }
        return $list;
    }

}
