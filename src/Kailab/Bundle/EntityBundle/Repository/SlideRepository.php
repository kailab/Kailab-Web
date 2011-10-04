<?php

namespace Kailab\Bundle\EntityBundle\Repository;

use Kailab\Bundle\SharedBundle\Repository\EntityRepository;

class SlideRepository extends EntityRepository
{
    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->getResult();
    }
}
