<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class BlogController extends Controller
{
    public function indexAction($page=1)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:BlogPost');

        $limit = 10;
        $pager = $repo->getActivePagination($limit);
        $page = min($page,$pager['last']);
        $pager['current'] = $page;

        $posts = $repo->findAllActiveInPage($page,$limit);

        $repo = $em->getRepository('KailabFrontendBundle:BlogCategory');
        $categories = $repo->findAllActiveOrdered();

        return $this->render('KailabFrontendBundle:Blog:index.html.twig',array(
            'categories'    => $categories,
            'posts'         => $posts,
            'pager'         => $pager
        ));
    }

    public function postAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:BlogPost');

        $post = $repo->findActive($id);
        if(!$post){
            throw new NotFoundHttpException('The post does not exist.');
        }

        $repo = $em->getRepository('KailabFrontendBundle:BlogCategory');
        $categories = $repo->findAllActiveOrdered();

        return $this->render('KailabFrontendBundle:Blog:post.html.twig',array(
            'categories'    => $categories,
            'post'          => $post,
        ));

    }

    public function CategoryAction($id, $page=1)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:BlogCategory');

        $category = $repo->findActive($id);
        if(!$category){
            throw new NotFoundHttpException('The category does not exist.');
        }
        $categories = $repo->findAllActiveOrdered();

        $repo = $em->getRepository('KailabFrontendBundle:BlogPost');

        $posts = $repo->findAllActiveInCategoryOrdered($category);

        $limit = 10;
        $pager = $repo->getCategoryPagination($category, $limit);
        $page = min($page,$pager['last']);
        $pager['current'] = $page;

        return $this->render('KailabFrontendBundle:Blog:category.html.twig',array(
            'categories'    => $categories,
            'category'      => $category,
            'posts'         => $posts,
            'pager'         => $pager,
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
