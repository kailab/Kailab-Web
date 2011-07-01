<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\FlattenException;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;

class ExceptionController extends Controller
{
    public function error401Action()
    {
        return $this->render('KailabFrontendBundle:Exception:error401.html.twig', array(
        ));
    }

    public function error404Action()
    {
        return $this->render('KailabFrontendBundle:Exception:error404.html.twig', array(
        ));
    }

    public function errorAction()
    {
        return $this->render('KailabFrontendBundle:Exception:error.html.twig', array(
        ));
    }

    public function exceptionAction(FlattenException $exception, DebugLoggerInterface $logger = null, $format = 'html', $embedded = false)
    {
        if($exception->getClass() == 'Symfony\Component\HttpKernel\Exception\NotFoundHttpException'){
            return $this->error404Action();
        }else if($exception->getClass() == 'Symfony\Component\Security\Core\Exception\AccessDeniedException'){
            return $this->error401Action();
        }else{
            return $this->errorAction();
        }
    }

}
 
