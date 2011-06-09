<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class VideogamesController extends Controller
{
    public function indexAction()
    {
        return $this->render('KailabFrontendBundle:Videogames:index.html.twig');
    }
}
