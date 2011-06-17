<?php

namespace Kailab\FrontendBundle\Repository;

class GameRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:Game';

    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->getResult();
    }

    public function findForSitemap()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->setMaxResults(5)->getResult();
    }

    public function findForHomepage()
    {
        try{
            return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
                ->setMaxResults(1)->getSingleResult();
        }catch(\Exception $e){
            return null;
        }
    }
}
