<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    /**
    * @Route("", name="backend_homepage")
    * @Route("/", name="backend_homepage_slash")
    * @Template()
    */
    public function indexAction()
    {
        return $this->render('KailabBackendBundle:Default:index.html.twig');
    }

}
