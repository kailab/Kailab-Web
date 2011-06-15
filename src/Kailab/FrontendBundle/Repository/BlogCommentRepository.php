<?php

namespace Kailab\FrontendBundle\Repository;

class BlogCommentRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:BlogComment';

    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.updated DESC')
            ->getResult();
    }

}
