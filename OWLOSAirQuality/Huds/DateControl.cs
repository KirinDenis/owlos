using OWLOSAdmin.EcosystemExplorer.Huds;

using System;
using System.Collections.Generic;
using System.Windows.Controls;
using System.Windows.Media;

namespace OWLOSAirQuality.Huds
{
    public class DateControl
    {

        private List<PentalControl> yearsPentals = new List<PentalControl>();

        private Grid HudGrid;
        private double radius;
        private int currentYear;
        public DateControl(Grid HudGrid, double radius, DateTime Date)
        {
            this.HudGrid = HudGrid;
            this.radius = radius;
            //Draw years 
            currentYear = Date.Year;
            DrawYears();
            //ENDOF Draw years 

            for (int i = 0; i < 12; i++)
            {
                PentalControl pental1 = new PentalControl(Gold.radius - 10, i * 10, 5, 10, (i + 1).ToString());
                HudGrid.Children.Add(pental1);

            }

            for (int i = 0; i < 31; i++)
            {
                PentalControl pental1 = new PentalControl(Gold.radius - 25, i * 10, 7, 10, (i + 1).ToString());
                HudGrid.Children.Add(pental1);
            }
        }

        private void DrawYears()
        {
            yearsPentals.Add(new PentalControl(radius + 12, 0, 20, 20, (currentYear - 1).ToString() + "     "));
            yearsPentals[0].petalBackground.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha2"];

            yearsPentals.Add(new PentalControl(radius + 12, 25, 20, 20, (currentYear).ToString() + "     "));
            yearsPentals[1].petalBackground.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSWarning"]; ;

            yearsPentals.Add(new PentalControl(radius + 12, 50, 20, 20, (currentYear + 1).ToString() + "     "));
            yearsPentals[2].petalBackground.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSSecondaryAlpha2"]; ;

            HudGrid.Children.Add(yearsPentals[0]);
            HudGrid.Children.Add(yearsPentals[1]);
            HudGrid.Children.Add(yearsPentals[2]);

        }

        public void SetDate(DateTime Date)
        {
            if (Date.Year != currentYear)
            {
                currentYear = Date.Year;

                HudGrid.Children.Remove(yearsPentals[0]);
                HudGrid.Children.Remove(yearsPentals[1]);
                HudGrid.Children.Remove(yearsPentals[2]);

                yearsPentals.Clear();
                DrawYears();
            }
        }
    }
}
