<?php

namespace Kailab\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class EntityCrudController extends Controller
{
    abstract protected function getFormType();

    protected $view_prefix = 'KailabBackendBundle:Default';
    protected $route_prefix = '';
    protected $entity_name = '';
    protected $limit = 20;

    protected function getLocales()
    {
        return array('en','es');
    }

    protected function getForm($entity)
    {
        $type = $this->getFormType();
        return $this->createForm($type, $entity);
    }

    protected function getEntityManager()
    {
        return $this->get('doctrine')->getEntityManager();
    }

    protected function getRepository()
    {
        return $this->getEntityManager()->getRepository($this->entity_name);
    }

    protected function getEntityMetadata()
    {
        return $this->getEntityManager()->getClassMetadata($this->entity_name);
    }

    protected function findEntity($id)
    {
        $entity = $this->getRepository()->find($id);
        if($entity){
            $entity = $this->fixEntityTranslations($entity);
        }
        return $entity;
    }

    protected function createTranslationEntity($locale)
    {
        $meta = $this->getEntityMetadata();
        if(!$meta->hasAssociation('translations')){
            return null;
        }
        $map = $meta->getAssociationMapping('translations');
        $trans_class = $map['targetEntity'];
        $trans = new $trans_class();
        $trans->setLocale($locale);
        return $trans;
    }

    protected function createEntity()
    {
        $meta = $this->getEntityMetadata();
        $entity = $meta->newInstance();
        $entity->__construct();
        $entity = $this->fixEntityTranslations($entity);
        return $entity;
    }

    protected function fixEntityTranslations($entity)
    {
        if(!method_exists($entity,'getTranslations')){
            return $entity;
        }
        $locales = $this->getLocales();
        $trans = $entity->getTranslations();
        if(!$trans){
            return $entity;
        }
        $meta = $this->getEntityMetadata();
        $map = $meta->getAssociationMapping('translations');
        $set_method = 'set'.$this->container->camelize($map['mappedBy']);
        foreach($locales as $locale){
            $found = false;
            foreach($trans as $t){
                if($t->getLocale() == $locale){
                    $found = true;
                    break;
                }
            }
            if(!$found){
                $t = $this->createTranslationEntity($locale);
                if(method_exists($t,$set_method)){
                    $t->$set_method($entity);
                }
                if($t){
                    $trans[] = $t;
                }
            }
        }

        return $entity;
    }

    protected function renderCrud($name, $args=array())
    {
        return $this->render($this->view_prefix.':'.$name.'.html.twig',$args);
    }

    protected function redirectCrud($name)
    {
        $url = $this->generateUrl($this->route_prefix.$name);
        return $this->redirect($url);
    }

    public function indexAction()
    {
        $repo = $this->getRepository();
        $request = $this->get('request');
        $page = $request->query->get('page',1);
        $entities = $repo->findAllInPage($page,$this->limit);
        $pager = $repo->getPagination($this->limit);
        $pager['current'] = $page;
        return $this->renderCrud('index',array(
            'entities'  => $entities,
            'pager'     => $pager,
        ));
    }

    public function newAction()
    {
        $request = $this->get('request');
        $entity = $this->createEntity();
        $form = $this->getForm($entity);

        if($request->getMethod() == 'POST'){
            if($this->processForm($form)){
                return $this->redirectCrud('list');
            }
        }
        return $this->renderCrud('form', array(
            'form'      => $form->createView(),
            'entity'    => $entity
        ));
    }

    public function editAction()
    {
        $request = $this->get('request');
        $entity = $this->findEntity($request->attributes->get('id'));

        if(!$entity){
            throw new NotFoundHttpException('The entity does not exist.');
        }
        $form = $this->getForm($entity);

        if($request->getMethod() == 'POST'){
            if($this->processForm($form)){
                return $this->redirectCrud('list');
            }
        }

        return $this->renderCrud('form', array(
            'form'      => $form->createView(),
            'entity'    => $entity
        ));
    }

    public function deleteAction()
    {
        $request = $this->get('request');
        $entity = $this->findEntity($request->attributes->get('id'));
        $em = $this->getEntityManager();
        $em->remove($entity);
        $em->flush();

        $url = $this->generateUrl($this->route_prefix.'list');
        return $this->redirect($url);
    }

    protected function processForm($form)
    {
        $request = $this->get('request');
        $session = $this->get('session');
        $form->bindRequest($request);
        if (!$form->isValid()) {
            $session->setFlash('error','Form is not valid.');
            return false;
        }
        $em = $this->getEntityManager();
        $entity = $form->getData();
        $em->persist($entity);
        $em->flush();

        $session->setFlash('notice','Entity saved correctly.', true);
        return true;
    }

}
