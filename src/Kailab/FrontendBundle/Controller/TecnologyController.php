<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class TecnologyController extends Controller
{
    public function indexAction()
    {
        return $this->render('KailabFrontendBundle:Tecnology:index.html.twig');
    }
}
