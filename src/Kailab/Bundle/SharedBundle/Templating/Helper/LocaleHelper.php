<?php

namespace Kailab\Bundle\SharedBundle\Templating\Helper;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\Locale\Locale;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

use Symfony\Component\HttpFoundation\Session;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;

class LocaleHelper extends Helper
{
    private $session;
    private $router;
    private $request;
    private $locales;

    public function __construct(array $locales=array(), Session $session=null, RouterInterface $router=null, Request $request=null)
    {
        $this->session = $session;
        $this->router = $router;
        $this->request = $request;
        $this->locales = $locales;
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
        if($this->session){
            return $this->session->getLocale();
        }
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
    
    public function currentRouteName()
    {
    	if(!$this->router){
    		throw new \RuntimeException('No request loaded');
    	}
    	$params = $this->request->attributes->all();
    	if(!isset($params['_route'])){
    		return null;
    	}
    	return $params['_route'];
    }

    public function path($locale)
    {
        if(!$this->request || !$this->router){
            throw new \RuntimeException('No router or request loaded');
        }
        $params = $this->request->attributes->all();
        if(!isset($params['_route'])){
            return null;
        }
        
        $route = $params['_route'];
        foreach($params as $k=>$v){
        	if(substr($k,0,1) == '_'){
        		unset($params[$k]);
        	}
        }
        $params['_locale'] = $locale;
        
        try{
            $locale_route = 'localized_'.$route;
            return $this->router->generate($locale_route, $params);
        }catch(RouteNotFoundException $e){
            return $this->router->generate($route, $params);
        }
    }

    public function locales()
    {
        $codes = array();
        if(isset($this->locales)){
            $codes = $this->locales;
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
