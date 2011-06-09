<?php

namespace Kailab\FrontendBundle\Repository;

use Doctrine\ORM\EntityRepository;

class SlideRepository extends EntityRepository
{
    public function findActiveOrdered()
    {
        return $this->getEntityManager()
            ->createQuery('SELECT s FROM KailabFrontendBundle:Slide s WHERE s.active = true ORDER BY s.position DESC')
            ->getResult();
    }
}
