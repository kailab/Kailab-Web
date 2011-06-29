<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ApplicationsController extends Controller
{
    protected $app_type = 'app';
    protected $view_dir = 'Applications';

    public function indexAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:App');
        $apps = $repo->findAllActiveOrdered($this->app_type);

        $view = 'KailabFrontendBundle:'.$this->view_dir.':index.html.twig';
        return $this->render($view,array(
            'apps'  => $apps
        ));
    }

    public function showAction($slug)
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:App');
        $app = $repo->findActiveBySlug($slug,$this->app_type);

        $view = 'KailabFrontendBundle:'.$this->view_dir.':show.html.twig';
        return $this->render($view,array(
            'appli'  => $app
        ));
    }
}
