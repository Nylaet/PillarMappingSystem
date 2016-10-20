/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.wildpark.pillarsystemmapping.facades;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import net.wildpark.pillarsystemmapping.entitys.Pillar;

/**
 *
 * @author Panker-RDP
 */
@Stateless
public class PillarFacade extends AbstractFacade<Pillar> {

    @PersistenceContext(unitName = "net.wildpark_PillarSystemMapping_war_1.0-SNAPSHOTPU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public PillarFacade() {
        super(Pillar.class);
    }
    
}
