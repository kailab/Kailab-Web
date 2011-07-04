<?php

namespace Kailab\FrontendBundle\Templating\Helper;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Locale\Locale;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

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

    public function locale()
    {
        $c = $this->code();
        if(strlen($c) == 2){
            $c = strtolower($c).'_'.strtoupper($c);
        }
        return $c;
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
        $params = $request->attributes->all();
        if(!isset($params['_route'])){
            return null;
        }
        $params['_locale'] = $locale;
        $route = $params['_route'];
        unset($params['_route']);
        
        try{
            $locale_route = 'localized_'.$route;
            return $router->generate($locale_route, $params);
        }catch(RouteNotFoundException $e){
            return $router->generate($route, $params);
        }
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

    public function format_time($format, $time=null)
    {
        $locale = $this->locale();
        $v = '';
        if($locale == 'C' || !$locale || substr($locale,0,2) == 'en'){
            switch(date('j')){
                case 1:
                    $v = 'st';
                    break;
                case 2:
                    $v = 'nd';
                default:
                    $v = 'th';
            };
        }
        $format = str_replace('%v',$v,$format);

        setlocale(LC_TIME, $locale);
        if($time instanceof \DateTime){
            $time = $time->getTimestamp();
        }
        if(is_string($time)){
            $time = strtotime($time);
        }
        $time = intval($time);
        return utf8_encode(strftime($format, $time));
    }

}
