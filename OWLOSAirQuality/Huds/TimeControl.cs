using OWLOSAdmin.EcosystemExplorer.Huds;
using OWLOSThingsManager.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    class TimeControl
    {
        private readonly PetalControl[] hourPetals = new PetalControl[24];
        private readonly PetalControl[] minuteAndSecondsPetals = new PetalControl[60];


        private readonly Grid HudGrid;
        private readonly double radius;
        private int currentHour = -1;
        private int currentMinute = -1;
        private int currentSecond = -1;
        public TimeControl(Grid HudGrid, double radius, DateTime Date)
        {
            this.HudGrid = HudGrid;
            this.radius = radius;

            CreateControls();
        }

        private void CreateControls()
        {
            for (int i = 0; i < 24; i++)
            {
                hourPetals[i] = new PetalControl(Gold.radius - 45, -12 + i * (360 / 24), 7, 10, (i).ToString());
                hourPetals[i].petalBackground.Stroke = null;
                hourPetals[i].petalBorder1.Stroke = null;
                hourPetals[i].petalBorder2.Stroke = null;
                hourPetals[i].petalNameText.Foreground = null;
                HudGrid.Children.Add(hourPetals[i]);
            }

            Path hourPath = new Path();
            hourPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - 45 - 7, 0, 359);
            hourPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
            HudGrid.Children.Add(hourPath);

            for (int i = 0; i < 60; i++)
            {
                minuteAndSecondsPetals[i] = new PetalControl(Gold.radius - 60, -12 + i * (360 / 60), 7, 10, (i).ToString());
                minuteAndSecondsPetals[i].petalBackground.Stroke = null;
                minuteAndSecondsPetals[i].petalBorder1.Stroke = null;
                minuteAndSecondsPetals[i].petalBorder2.Stroke = null;
                minuteAndSecondsPetals[i].petalNameText.Foreground = null;
                HudGrid.Children.Add(minuteAndSecondsPetals[i]);
            }
        }

        public void SetTime(DateTime Date)
        {

            Color currentColor;

            if (Date.Hour != currentHour)
            {
                //check if month petal path text is ready
                if (hourPetals[0].pathText == null)
                {
                    return;
                }
                currentHour = Date.Hour;


                int hideStep = 255 / 24;

                for (int i = 0; i < 24; i++)
                {

                    if (currentHour == i)
                    {
                        hourPetals[i].pathText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                    }
                    else
                    {
                        currentColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
                        if (currentHour > i)
                        {
                            currentColor.A -= (byte)((currentHour - i) * hideStep);
                            hourPetals[i].pathText.Foreground = new SolidColorBrush(currentColor);
                        }
                        else
                        {
                            currentColor.A -= (byte)((i - currentHour) * hideStep);
                            hourPetals[i].pathText.Foreground = new SolidColorBrush(currentColor);
                        }
                    }
                }
            }


            if (Date.Minute != currentMinute)
            {
                //check if month petal path text is ready
                if (minuteAndSecondsPetals[0].pathText == null)
                {
                    return;
                }
                currentMinute = Date.Minute;

                minuteAndSecondsPetals[currentMinute].pathText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSSuccess"];
            }

            if (Date.Second != currentSecond)
            {
                //check if month petal path text is ready
                if (minuteAndSecondsPetals[0].pathText == null)
                {
                    return;
                }
                currentSecond = Date.Second;

                if (currentMinute != currentSecond)
                {
                    minuteAndSecondsPetals[currentSecond].pathText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                }

                int hideLevel = 250;

                int hideStep = hideLevel / 30;
                currentColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
                for (int i = currentSecond; i > currentSecond - 30; i--)
                {
                    int realIndex = i;
                    if (realIndex < 0)
                    {
                        realIndex += 60;
                    }

                    if ((currentMinute == realIndex) || (currentSecond == realIndex))
                    {
                        continue;
                    }

                    currentColor.A -= (byte)(hideStep);
                    minuteAndSecondsPetals[realIndex].pathText.Foreground = new SolidColorBrush(currentColor);

                }

                hideStep = hideLevel / 30;
                currentColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
                for (int i = currentSecond; i < currentSecond + 30; i++)
                {
                    int realIndex = i;
                    if (realIndex > 59)
                    {
                        realIndex -= 60;
                    }

                    if ((currentMinute == realIndex) || (currentSecond == realIndex))
                    {
                        continue;
                    }

                    currentColor.A -= (byte)(hideStep);
                    minuteAndSecondsPetals[realIndex].pathText.Foreground = new SolidColorBrush(currentColor);

                }
            }
        }
    }
}
