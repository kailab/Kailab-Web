<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\BlogPostType;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\ParameterAsset;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class BlogPostController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:BlogPost';
    protected $view_prefix = 'KailabBackendBundle:BlogPost';
    protected $route_prefix = 'backend_blog_post_';

    protected function getFormType()
    {
        return new BlogPostType();
    }

    protected function saveEntity($entity)
    {
        $asset = $entity->getImage()->getAsset();

        $sizes = array('big'=>150, 'small'=>90);
        if($asset instanceof AssetInterface){
            // resize image
            $imagine = new Imagine();
            $image = $imagine->load($asset->getContent());
            foreach($sizes as $name=>$width){
                $box = $image->getSize()->scale($width/$image->getSize()->getWidth());
                $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);
                $asset = new ParameterAsset(array(
                    'content'       => $thumb->get('png'),
                    'content_type'  => 'image/png'
                ));
                $entity->setImage($asset, $name);
            }
        }
        return parent::saveEntity($entity);
    }

}
