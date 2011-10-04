<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('KailabBackendBundle:Default:index.html.twig');
    }

}
