<?php

namespace Kailab\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('KailabBackendBundle:Default:index.html.twig');
    }

}
