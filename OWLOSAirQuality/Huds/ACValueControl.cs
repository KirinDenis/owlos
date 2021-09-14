using OWLOSAirQuality.Huds;
using OWLOSEcosystemService.DTO.Things;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static OWLOSEcosystemService.DTO.Things.ThingAirQuality;

namespace OWLOSAirQuality.Huds
{
    class ACValueControl: ValueControl
    {
        public ACValueControl(string valueName, string valueDescription, string  descriprtion) :base()
        {            
            this.valueName = valueName;
            this.valueDescription = valueDescription;
            this.description = descriprtion;
        }

        public void OnValueChanged(object sender, ACValueEventArgs e)
        {
            base.Dispatcher.Invoke(() =>
            {
                if (e.value != null)
                {
                    value = e.value.ToString();
                }
                else
                {
                    value = "--";
                }
            });
        }

    }
}
