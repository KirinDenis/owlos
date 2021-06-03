using OWLOSAdmin.EcosystemExplorer.Huds;

using System;
using System.Collections.Generic;
using System.Windows.Controls;
using System.Windows.Media;

namespace OWLOSAirQuality.Huds
{
    public class DateControl
    {

        private readonly List<PentalControl> yearsPentals = new List<PentalControl>();
        private readonly PentalControl[] monthPentals = new PentalControl[12];
        private readonly PentalControl[] dayPentals = new PentalControl[31];
        private readonly Grid HudGrid;
        private readonly double radius;
        private int currentYear;
        private int currentMonth;
        private int currentDay;
        public DateControl(Grid HudGrid, double radius, DateTime Date)
        {
            this.HudGrid = HudGrid;
            this.radius = radius;
            //Draw years 
            currentYear = Date.Year;
            DrawYears();
            //ENDOF Draw years 
            DrawMonth();
            DrawDays();
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

        private void DrawMonth()
        {            
            for (int i = 0; i < 12; i++)
            {
                string currentMonthName = string.Empty;
                switch (i)
                {
                    case 0: currentMonthName = "January"; break;
                    case 1: currentMonthName = "February"; break;
                    case 2: currentMonthName = "March"; break;
                    case 3: currentMonthName = "April"; break;
                    case 4: currentMonthName = "May"; break;
                    case 5: currentMonthName = "June"; break;
                    case 6: currentMonthName = "July"; break;
                    case 7: currentMonthName = "August"; break;
                    case 8: currentMonthName = "September"; break;
                    case 9: currentMonthName = "October"; break;
                    case 10: currentMonthName = "November"; break;
                    case 11: currentMonthName = "December"; break;
                }

                monthPentals[i] = new PentalControl(Gold.radius - 10, i *  15, currentMonthName.Length * 2,  15 , currentMonthName);
                monthPentals[i].petalBackground.Stroke = null;
                monthPentals[i].petalBorder1.Stroke = null;
                monthPentals[i].petalBorder2.Stroke = null;
                monthPentals[i].petalNameText.Foreground = null;
                HudGrid.Children.Add(monthPentals[i]);                
            }
        }

        private void DrawDays()
        {
            for (int i = 0; i < 31; i++)
            {
                dayPentals[i] = new PentalControl(Gold.radius - 25, i * 5, 7, 5, (i + 1).ToString());
                dayPentals[i].petalBackground.Stroke = null;
                dayPentals[i].petalBorder1.Stroke = null;
                dayPentals[i].petalBorder2.Stroke = null;
                dayPentals[i].petalNameText.Foreground = null;
                HudGrid.Children.Add(dayPentals[i]);
            }
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

            if (Date.Month != currentMonth)
            {
                //check if month petal path text is ready
                if (monthPentals[0].pathText == null)
                {
                    return;
                }
                currentMonth = Date.Month;
                Color currentMonthColor;
                int hideStep = 15;

                for (int i = 0; i < 12; i++)
                {

                    if (currentMonth == (i + 1))
                    {
                        monthPentals[i].pathText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                    }
                    else
                    {
                        currentMonthColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
                        if (currentMonth > (i + 1))
                        {
                            currentMonthColor.A -= (byte)((currentMonth - i) * hideStep);
                            monthPentals[i].pathText.Foreground = new SolidColorBrush(currentMonthColor);
                        }
                        else
                        {
                            currentMonthColor.A -= (byte)((i - currentMonth) * hideStep);
                            monthPentals[i].pathText.Foreground = new SolidColorBrush(currentMonthColor);
                        }
                    }
                }
            }

            if (Date.Day != currentDay)
            {
                //check if day petal path text is ready
                if (dayPentals[0].pathText == null)
                {
                    return;
                }
                currentDay = Date.Day;
                Color currentDayColor;
                int hideStep = 7;

                for (int i = 0; i < 31; i++)
                {

                    if (currentDay == (i + 1))
                    {
                        dayPentals[i].pathText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                    }
                    else
                    {
                        currentDayColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
                        if (currentDay > (i + 1))
                        {
                            currentDayColor.A -= (byte)((currentDay - i) * hideStep);
                            dayPentals[i].pathText.Foreground = new SolidColorBrush(currentDayColor);
                        }
                        else
                        {
                            currentDayColor.A -= (byte)((i - currentDay) * hideStep);
                            dayPentals[i].pathText.Foreground = new SolidColorBrush(currentDayColor);
                        }
                    }
                }
            }
        }
    }
}
