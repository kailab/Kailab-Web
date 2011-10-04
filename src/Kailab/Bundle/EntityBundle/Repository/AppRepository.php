<?php

namespace Kailab\Bundle\EntityBundle\Repository;

use Kailab\Bundle\EntityBundle\Entity\AppTranslation;

use Kailab\Bundle\EntityBundle\Entity\App;

use Kailab\Bundle\SharedBundle\Repository\EntityRepository;

class AppRepository extends EntityRepository
{
    public function findAllActiveOrdered($type='app',$max=null)
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.type = :type ORDER BY e.position DESC')
            ->setParameter('type',$type)->setMaxResults($max)->getResult();
    }

    public function findForSitemap($type='app')
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.type = :type ORDER BY e.position DESC')
            ->setParameter('type',$type)->setMaxResults(5)->getResult();
    }

    public function findForHomepage($type='app')
    {
    	return $this->createEntityQuery('WHERE e.active = true AND e.type = :type ORDER BY e.position DESC')
        ->setParameter('type',$type)->setMaxResults(1)->getOneOrNullResult();
    }

    public function findActiveBySlug($slug, $type='app')
    {
    	return $this->createEntityQuery('WHERE e.active = true AND e.slug = :slug AND e.type = :type')
    	->setParameter('slug',$slug)->setParameter('type',$type)->getOneOrNullResult();

    }
    
    public function deleteScreenshots(App $app)
    {
    	$id = $app->getId();
    	if(!$id){
    		return false;
    	}
    	$em = $this->getEntityManager();
    	$q = 'DELETE FROM KailabEntityBundle:AppScreenshot s WHERE s.app = :id';
    	return $em->createQuery($q)->setParameter('id',$id)->execute();
    }
    
    public function deleteTranslationLinks(AppTranslation $trans)
    {
    	$em = $this->getEntityManager();
    	$ids = array($trans->getId());
    	$q = array("s.translation = ?0");
    	$i = 1;
    	foreach($trans->getLinks() as $link){
    		if($link->getId()){
    			$ids[] = $link->getId();
    			$q[] = "s.id != ?".$i++;
    		}
    	}
    	$q = 'DELETE FROM KailabEntityBundle:AppTranslationLink s WHERE '
    	. implode(" AND ", $q);
    	return $em->createQuery($q)->setParameters($ids)->execute();
    }
    
    public function deleteLinks(App $app)
    {
    	foreach($app->getTranslations() as $trans){
    		$this->deleteTranslationLinks($trans);
    	}
    }

}
