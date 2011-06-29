<?php

namespace Kailab\FrontendBundle\Templating\Helper;

use Symfony\Component\Templating\Helper\Helper;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Locale\Locale;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

class FrontendHelper extends Helper
{
    private $container;
    private $config;

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

    public function mailto($email,$text=null)
    {
        $text = $text ? $text : $email;
        return "<a href=\"mailto:".$email."\">".$text.'</a>';
    }

    public function sitemap_technologies()
    {
        $repo = $this->getRepository('KailabFrontendBundle:Tech');
        return $repo->findForSitemap();
    }

    public function sitemap_applications()
    {
        $repo = $this->getRepository('KailabFrontendBundle:App');
        return $repo->findForSitemap('app');
    }

    public function sitemap_videogames()
    {
        $repo = $this->getRepository('KailabFrontendBundle:App');
        return $repo->findForSitemap('game');
    }

    public function __call($name, $params)
    {
        if(isset($this->config[$name])){
            return $this->config[$name];
        }
    }

}
