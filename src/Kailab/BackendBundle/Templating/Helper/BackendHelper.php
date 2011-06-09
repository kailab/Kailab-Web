<?php

namespace Kailab\BackendBundle\Templating\Helper;

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

    public function format_locale($code)
    {
        $all = Locale::getDisplayLocales(Locale::getDefault());
    }

    public function locale()
    {
        return Locale::getDefault();
    }

    public function languages()
    {
        $codes = array();
        if(isset($this->config['languages'])){
            $codes = $this->config['languages'];
        }
        if(!is_array($codes)){
            $codes = array($codes);
        }
        $langs = array();
        foreach($codes as $code){
            $all = Locale::getDisplayLocales($code);
            $langs[$code] = isset($all[$code]) ? $all[$code] : $code;
        }
        return $langs;
    }

}
