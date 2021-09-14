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
    /// <summary>
    /// Interaction logic for ValueControl.xaml
    /// </summary>
    public partial class ValueControl : UserControl
    {

        public string value
        {
            get
            {
                return ValueTextBlock?.Text;
            }
            set
            {
                if (ValueTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        ValueTextBlock.Text = value;
                    }
                    else
                    {
                        ValueTextBlock.Text = "--";
                    }
                }
            }
        }

        public string valueName
        {
            get
            {
                    return NameTextBlock?.Text;
            }
            set
            {
                if (NameTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        NameTextBlock.Text = value;
                    }
                    else
                    {
                        NameTextBlock.Text = "--";
                    }
                }                
            }
        }

        public string valueDescription
        {
            get
            {
                return ValueDescriptionTextBlock?.Text;
            }
            set
            {
                if (ValueDescriptionTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        ValueDescriptionTextBlock.Text = value;
                    }
                    else
                    {
                        ValueDescriptionTextBlock.Text = "--";
                    }
                }
            }
        }

        public string description
        {
            get
            {
                return DescriptionTextBlock?.Text;
            }
            set
            {
                if (DescriptionTextBlock?.Text != null)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        DescriptionTextBlock.Text = value;
                    }
                    else
                    {
                        DescriptionTextBlock.Text = "--";
                    }
                }
            }
        }


        
        public ValueControl()
        {
            InitializeComponent();
        }
    }
}
