<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\BackendBundle\Form\AppType;
use Symfony\Component\HttpFoundation\Response;

class AppController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:App';
    protected $view_prefix = 'KailabBackendBundle:App';
    protected $route_prefix = 'backend_app_';

    protected function getFormType()
    {
        return new AppType();
    }

    protected function saveEntity($entity)
    {
        $em = $this->getEntityManager();
        $em->persist($entity);
        // remove empty links
        foreach($entity->getTranslations() as $trans){
            foreach($trans->getLinks() as $link){
                if(!$link->getTitle() || !$link->getUrl()){
                    $em->remove($link);
                }else{
                    $link->setTranslation($trans);
                }
            }
        }
        // remove old screenshots
        foreach($entity->getAppScreenshots() as $shot){
            if(!$shot->getApp()){
                $em->remove($shot);
            }
        }
        $em->flush();
    }

    public function upAction($id)
    {
        $entity = $this->findEntity($id);
        $position = $entity->getPosition();
        $entity->setPosition($position-1);
        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();
        $session = $this->get('session');
        $session->setFlash('notice','App was moved up.');
        return $this->redirectCrud('list');
    }

    public function downAction($id)
    {
        $entity = $this->findEntity($id);
        $position = $entity->getPosition();
        $entity->setPosition($position+1);
        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();
        $session = $this->get('session');
        $session->setFlash('notice','App was moved down.');
        return $this->redirectCrud('list');
    }

}
