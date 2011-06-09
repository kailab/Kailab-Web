<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BlogController extends Controller
{
    public function indexAction($page=1)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:BlogPost');

        $limit = 10;
        $pager = $repo->getPagination($limit);
        $page = min($page,$pager['last']);
        $pager['current'] = $page;

        $posts = $repo->findInPage($page,$limit);

        return $this->render('KailabFrontendBundle:Blog:index.html.twig',array(
            'posts' => $posts,
            'pager' => $pager
        ));
    }

    public function postImageAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:BlogPost');
        $slide = $repo->find($id);
        $img = $slide->getImage();
        return $img->getResponse();
    }
}
