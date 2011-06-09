<?php

namespace Kailab\FrontendBundle\Repository;

use Doctrine\ORM\EntityRepository;

class BlogPostRepository extends EntityRepository
{
    public function findActiveOrdered()
    {
        return $this->getEntityManager()
            ->createQuery('SELECT p FROM KailabFrontendBundle:BlogPost p WHERE s.active = true ORDER BY s.updated DESC')
            ->getResult();
    }
}
