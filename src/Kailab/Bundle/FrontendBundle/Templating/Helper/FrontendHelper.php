<?php

namespace Kailab\Bundle\FrontendBundle\Templating\Helper;

use Symfony\Component\DependencyInjection\ContainerInterface;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

class FrontendHelper extends Helper
{
    protected $config = null;
    protected $container = null;
    
    public function __construct(ContainerInterface $container, array $config=array())
    {
        $this->container = $container;
        $this->config = $config;
    }

    protected function getEntityManager()
    {
        return $this->container->get('doctrine')->getEntityManager();
    }

    protected function getRepository($name)
    {
        return $this->getEntityManager()->getRepository($name);
    }

    public function getName()
    {
        return 'frontend';
    }

    public function getConfiguration()
    {
        return $this->config;
    }
    
    public function getMainMenuItems()
    {
    	if(!isset($this->config['main_menu'])){
    		return array();
    	}
    	if(!is_array($this->config['main_menu'])){
    		return array();
    	}
    	return $this->config['main_menu'];
    }
    
    public function getSitemapTechnologies()
    {
    	$repo = $this->getRepository('KailabEntityBundle:Tech');
    	return $repo->findForSitemap();
    }
    
    public function getSitemapApplications()
    {
    	$repo = $this->getRepository('KailabEntityBundle:App');
    	return $repo->findForSitemap('app');
    }
    
    public function getSitemapVideogames()
    {
    	$repo = $this->getRepository('KailabEntityBundle:App');
    	return $repo->findForSitemap('game');
    }
    
    public function hasFrequentlyAsquedQuestions()
    {
    	$repo = $this->getRepository('KailabEntityBundle:Question');
    	return $repo->countAllActive() > 0;
    }
    
    public function getAnalytics($host=null)
    {
    	$keys = $this->config['analytics'];
    	$key = null;
    	if(is_string($keys)){
    		$key = $keys;
    	}else if(is_array($keys)){
    		foreach($keys as $domain=>$k){
    			if(strrpos($host,$domain) == strlen($host)-strlen($domain)){
    				$key = $k;
    				break;
    			}
    		}
    	}
    	if($key){
    		return json_encode($key);
    	}
    }
}
