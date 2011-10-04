<?php

namespace Kailab\Bundle\FrontendBundle\Controller;

use Kailab\Bundle\FrontendBundle\Form\BlogCommentType;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class BlogController extends Controller
{
	/**
	* @Route("/blog", name="frontend_blog")
 	* @Route("/blog/{page}", name="frontend_blog_page")
	* @Template()
	*/
    public function indexAction($page=1)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabEntityBundle:BlogPost');

        $limit = 10;
        $pager = $repo->getActivePagination($limit);
        $page = min($page,$pager['last']);
        $pager['current'] = $page;

        $posts = $repo->findAllActiveInPage($page,$limit);

        $repo = $em->getRepository('KailabEntityBundle:BlogCategory');
        $categories = $repo->findAllActiveOrdered();

        return array(
            'categories'    => $categories,
            'posts'         => $posts,
            'pager'         => $pager
        );
    }

    /**
    * @Route("/blog/post/{id}", name="frontend_blog_post")
    * @Template()
    */
    public function postAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabEntityBundle:BlogPost');

        // find post
        $post = $repo->findActive($id);
        if(!$post){
            throw new NotFoundHttpException('The post does not exist.');
        }

        // categories
        $repo = $em->getRepository('KailabEntityBundle:BlogCategory');
        $categories = $repo->findAllActiveOrdered();

        // comment form
        $type = new BlogCommentType();
        $form = $this->createForm($type);
        $request = $this->get('request');

        if($request->getMethod() == 'POST'){
            $t = $this->get('translator');

            // try to save submitted comment
            $session = $this->get('session');
            $form->bindRequest($request);
            if (!$form->isValid()) {
                $msg = $t->trans('Your comment is not valid.');
                $session->setFlash('error',$msg, false);
            }else{
                $comment = $form->getData();
                $comment->setPost($post);
                $comment->setActive(false);
                $em->persist($comment);
                $em->flush();
                $msg = $t->trans('Your comment was saved correctly. It will appear on this post after it has been activated.');
                $session->setFlash('notice',$msg, false);
            }
        }

        // comments
        $repo = $em->getRepository('KailabEntityBundle:BlogComment');
        $comments = $repo->findAllActiveOrderedForPost($post);

        return array(
            'categories'    => $categories,
            'post'          => $post,
            'comments'      => $comments,
            'form'          => $form->createView()
        );
    }

    /**
    * @Route("/blog/category/{id}", name="frontend_blog_category")
    * @Template()
    */
    public function CategoryAction($id, $page=1)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabEntityBundle:BlogCategory');

        $category = $repo->findActive($id);
        if(!$category){
            throw new NotFoundHttpException('The category does not exist.');
        }
        $categories = $repo->findAllActiveOrdered();

        $repo = $em->getRepository('KailabEntityBundle:BlogPost');

        $posts = $repo->findAllActiveInCategoryOrdered($category);

        $limit = 10;
        $pager = $repo->getCategoryPagination($category, $limit);
        $page = min($page,$pager['last']);
        $pager['current'] = $page;

        return array(
            'categories'    => $categories,
            'category'      => $category,
            'posts'         => $posts,
            'pager'         => $pager,
        );
    }

}
