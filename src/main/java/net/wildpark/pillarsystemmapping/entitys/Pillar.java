package net.wildpark.pillarsystemmapping.entitys;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import net.wildpark.pillarsystemmapping.enums.PillarOwner;
import org.primefaces.model.map.LatLng;

/**
 *
 * @author Panker-RDP
 */
@Entity
public class Pillar implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private PillarOwner pillarOwner;
    private boolean haveCoupling=false;
    private boolean haveReserve=false;
    private LatLng latLng;
    private String latLngString;
    private String about;
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date createDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PillarOwner getPillarOwner() {
        return pillarOwner;
    }

    public void setPillarOwner(PillarOwner pillarOwner) {
        this.pillarOwner = pillarOwner;
    }

    public boolean isHaveCoupling() {
        return haveCoupling;
    }

    public void setHaveCoupling(boolean haveCoupling) {
        this.haveCoupling = haveCoupling;
    }

    public boolean isHaveReserve() {
        return haveReserve;
    }

    public void setHaveReserve(boolean haveReserve) {
        this.haveReserve = haveReserve;
    }

    public LatLng getLatLng() {
        return latLng;
    }

    public void setLatLng(LatLng latLng) {
        latLngString=String.valueOf(latLng.getLat())+String.valueOf(latLng.getLng());
        this.latLng = latLng;
    }

    public String getLatLngString() {
        return latLngString;
    }

    private void setLatLngString(String latLngString) {
        this.latLngString = latLngString;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }
    
    
    
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Pillar)) {
            return false;
        }
        Pillar other = (Pillar) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return id+" : "+latLngString;
    }
    
}
