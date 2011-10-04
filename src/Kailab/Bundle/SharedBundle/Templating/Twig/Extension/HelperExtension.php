<?php

namespace Kailab\Bundle\SharedBundle\Templating\Twig\Extension;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Adds a Helper as a global to the twig template.
 */
class HelperExtension extends \Twig_Extension
{
    protected $helper;

    public function __construct($helper, $container=null)
    {
    	if($helper instanceof Helper){
    		$this->helper = $helper;
    	}else if(is_string($helper) && $container instanceof ContainerInterface){
    		try{
    			$this->helper = $container->get($helper);
    		}catch(\Exception $e){
    		}
    	}
    }

    public function initRuntime(\Twig_Environment $environment)
    {
    	if($this->helper instanceof Helper){
        	$environment->addGlobal($this->getName(),$this->helper);
    	}
    }

    public function getName()
    {   
    	if($this->helper instanceof Helper){
        	return $this->helper->getName().'_helper';
    	}
    }
}
