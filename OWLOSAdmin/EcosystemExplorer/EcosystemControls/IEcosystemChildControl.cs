using System;
using System.Collections.Generic;
using System.Text;

namespace OWLOSThingsManager.EcosystemExplorer
{
    public interface IEcosystemChildControl
    {

        EcosystemControl parentControl { get; set; }
        void OnParentGetFocus();

        void OnParentLostFocus();

        void OnParentDrag();

        void OnParentDrop();

    }
}
