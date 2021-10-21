using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    public partial class ModeControl : UserControl
    {

        public string TopDescription
        {
            get => _TopDescription != null ? _TopDescription.Text : string.Empty;
            set
            {
                if (_TopDescription != null)
                {
                    _TopDescription.Text = value;
                }
            }
        }

        public string Caption
        {
            get => _Caption != null ? _Caption.Text : string.Empty;
            set
            {
                if (_Caption != null)
                {
                    _Caption.Text = value;
                }
            }
        }

        public string DownDescription
        {
            get => _DownDescription != null ? _DownDescription.Text : string.Empty;
            set
            {
                if (_DownDescription != null)
                {
                    _DownDescription.Text = value;
                }
            }
        }

        public ModeControl()
        {
            InitializeComponent();
        }
    }
}
