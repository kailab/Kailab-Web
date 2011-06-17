<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Form\BlogCommentType;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

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

        // find post
        $post = $repo->findActive($id);
        if(!$post){
            throw new NotFoundHttpException('The post does not exist.');
        }

        // categories
        $repo = $em->getRepository('KailabFrontendBundle:BlogCategory');
        $categories = $repo->findAllActiveOrdered();

        // comment form
        $type = new BlogCommentType();
        $form = $this->createForm($type);
        $request = $this->get('request');

        if($request->getMethod() == 'POST'){
            // try to save submitted comment
            $session = $this->get('session');
            $form->bindRequest($request);
            if (!$form->isValid()) {
                $session->setFlash('error','Comment is not valid.');
            }else{
                $comment = $form->getData();
                $comment->setPost($post);
                $em->persist($comment);
                $em->flush();
                $session->setFlash('notice','Comment saved correctly.');
            }
        }

        // comments
        $repo = $em->getRepository('KailabFrontendBundle:BlogComment');
        $comments = $repo->findAllActiveOrderedForPost($post);

        return $this->render('KailabFrontendBundle:Blog:post.html.twig',array(
            'categories'    => $categories,
            'post'          => $post,
            'comments'      => $comments,
            'form'          => $form->createView()
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

    protected function getPostAsset($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:BlogPost');

        $shot = $repo->find($id);
        if(!$shot){
            throw new NotFoundHttpException('The post does not exist.');
        }
        $asset = $shot->getImage()->getAsset();
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The post does not have a valid asset.');
        }
        return $asset;
    }

    protected function getImageResponse(ImageInterface $img)
    {
        $response = new Response();
        $response->setContent($img->get('png'));
        $response->headers->set('Content-Type','image/png');
        return $response;
    }

    public function postImageAction($id)
    {
        $asset = $this->getPostAsset($id);

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = $image->getSize()->scale(150/$image->getSize()->getWidth());
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        return $this->getImageResponse($thumb);
    }

    public function postImageSmallAction($id)
    {
        $asset = $this->getPostAsset($id);

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = $image->getSize()->scale(90/$image->getSize()->getWidth());
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        return $this->getImageResponse($thumb);
    }
}
