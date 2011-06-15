<?php

namespace Kailab\FrontendBundle\Repository;

class AppRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:App';

    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->getResult();
    }
}
