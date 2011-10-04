<?php

namespace Kailab\Bundle\SharedBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class EntityCrudController extends Controller
{
    abstract protected function getFormType();
    abstract protected function getViewPrefix();
    abstract protected function getRoutePrefix();
    abstract protected function getEntityName();

    protected $limit = 10;
    
    protected function getLocales()
    {
        return $this->container->getParameter('kailab_shared.locales');
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
        return $this->getEntityManager()->getRepository($this->getEntityName());
    }

    protected function getEntityMetadata()
    {
        return $this->getEntityManager()->getClassMetadata($this->getEntityName());
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
        return $this->render($this->getViewPrefix().':'.$name.'.html.twig',$args);
    }

    protected function redirectCrud($name)
    {
        $url = $this->generateUrl($this->getRoutePrefix().$name);
        return $this->redirect($url);
    }
    
    protected function findById($id=null)
    {
    	if($id === null){
	    	$request = $this->get('request');
	    	$id = $request->attributes->get('id');
    	}
    	$entity = $this->findEntity($id);
    	if(!$entity){
    		throw new NotFoundHttpException('The entity does not exist.');
    	}
    	return $entity;
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
                return $this->redirectCrud('index');
            }
        }
        return $this->renderCrud('form', array(
            'form'      => $form->createView(),
            'entity'    => $entity
        ));
    }

    public function editAction($id)
    {
        $entity = $this->findById($id);
        $form = $this->getForm($entity);
        $request = $this->get('request');
        if($request->getMethod() == 'POST'){
            if($this->processForm($form)){
                return $this->redirectCrud('index');
            }
        }

        return $this->renderCrud('form', array(
            'form'      => $form->createView(),
            'entity'    => $entity
        ));
    }

    public function deleteAction($id)
    {
        $entity = $this->findById($id);
        $em = $this->getEntityManager();
        $em->remove($entity);
        $em->flush();

        return $this->redirectCrud('index');
    }

    public function toggleAction($id)
    {
    	$entity = $this->findById($id);
        $entity->setActive($entity->getActive() ? false : true);

        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();

        $session = $this->get('session');
        $session->setFlash('notice','Entity toggled correctly.', true);

        return $this->redirectCrud('index');
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
    	$session->setFlash('notice','Entity was moved up.');
    	return $this->redirectCrud('index');
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
    	$session->setFlash('notice','Entity was moved down.');
    	return $this->redirectCrud('index');
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
        $entity = $form->getData();
        $this->saveEntity($entity);

        $session->setFlash('notice','Entity saved correctly.', true);
        return true;
    }

    protected function saveEntity($entity)
    {
        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();
    }

}
