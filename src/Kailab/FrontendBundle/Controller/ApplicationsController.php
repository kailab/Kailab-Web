<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ApplicationsController extends Controller
{
    public function indexAction()
    {

        $em = $this->get('doctrine')->getEntityManager();

        $repo = $em->getRepository('KailabFrontendBundle:App');
        $apps = $repo->findAllActiveOrdered();


        return $this->render('KailabFrontendBundle:Applications:index.html.twig',array(
            'apps'  => $apps
        ));
    }
}
