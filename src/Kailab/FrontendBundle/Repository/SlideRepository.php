<?php

namespace Kailab\FrontendBundle\Repository;

class SlideRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:Slide';

    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->getResult();
    }
}
