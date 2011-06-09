<?php

/*
 * This file is part of the Symfony framework.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Slide');
        $slides = $repo->findActiveOrdered();

        $repo = $em->getRepository('KailabFrontendBundle:Slide');
        $slides = $repo->findActiveOrdered();

        return $this->render('KailabFrontendBundle:Default:index.html.twig',array(
            'slides'    => $slides
        ));
    }

    public function slideAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Slide');
        $slide = $repo->find($id);
        $img = $slide->getImage();
        return $img->getResponse();
    }

    public function aboutAction()
    {
        return $this->render('KailabFrontendBundle:Default:about.html.twig');
    }

    public function contactAction()
    {
        return $this->render('KailabFrontendBundle:Default:contact.html.twig');
    }

    public function legalAction()
    {
        return $this->render('KailabFrontendBundle:Default:legal.html.twig');
    }

    public function faqAction()
    {
        return $this->render('KailabFrontendBundle:Default:faq.html.twig');
    }

}
