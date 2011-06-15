<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
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

    public function uploadAction()
    {
        $request = $this->get('request');
        $session = $this->get('session');
        $files = $request->files->all();
        $dir = sys_get_temp_dir().'/'.$this->route_prefix;

        @mkdir($dir,0555,true);

        $data = $session->get($this->route_prefix);
        if(!is_array($data)){
            $data = array();
        }
        $urls = array();

        // copy temporary files
        foreach($files as $file){
            try{
                $file->move($dir);
                $urls[] = $this->generateUrl('backend_app_temp_image',
                    array('id' => count($data)));
                $data[] = array(
                    'path'  => $file->getPath(),
                    'type'  => $file->getMimeType(),
                    'name'  => $file->getOriginalName(),
                );
            }catch(\Exception $e){
            }
        }

        $session->set($this->route_prefix,$data);
        $response = new Response(json_encode($urls));
        // $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function imageAction($id, $temp=false)
    {
        $entity = $this->findEntity($id);
        $img = $entity->getImage();
        return $img->getResponse();
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
