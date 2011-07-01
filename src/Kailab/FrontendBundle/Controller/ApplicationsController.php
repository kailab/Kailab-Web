<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ApplicationsController extends Controller
{
    protected $app_type = 'app';
    protected $view_dir = 'Applications';

    public function showcaseAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:App');
        $apps = $repo->findAllActiveOrdered($this->app_type,5);

        $view = 'KailabFrontendBundle:'.$this->view_dir.':showcase.html.twig';
        $pager = $repo->getActivePagination(5);

        return $this->render($view,array(
            'apps'  => $apps,
            'more'  => $pager['last'] > 1
        ));
    }

    public function indexAction()
    {
        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:App');
        $apps = $repo->findAllActiveOrdered($this->app_type,15);

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

        if(!$app){
            throw new NotFoundHttpException('The application does not exist.');
        }
        $view = 'KailabFrontendBundle:'.$this->view_dir.':show.html.twig';
        return $this->render($view,array(
            'appli'  => $app
        ));
    }
}
