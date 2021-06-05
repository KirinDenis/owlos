using OWLOSAdmin.EcosystemExplorer.Huds;
using OWLOSThingsManager.EcosystemExplorer.Huds;
using System;
using System.Collections.Generic;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace OWLOSAirQuality.Huds
{
    public class DateControl
    {

        private PetalControl yearPetal;
        private readonly PetalControl[] monthPetals = new PetalControl[12];
        private readonly PetalControl[] dayPetals = new PetalControl[31];
        private readonly Grid HudGrid;
        private readonly double radius;
        private int currentYear = -1;
        private int currentMonth = -1;
        private int currentDay = -1;
        public DateControl(Grid HudGrid, double radius, DateTime Date)
        {
            this.HudGrid = HudGrid;
            this.radius = radius;


            PetalControl yearPetalName = new PetalControl(radius - 10, -10, 20, 20, "year");
            yearPetalName.petalBackground.Stroke = null;
            yearPetalName.petalBorder1.Stroke = null;
            yearPetalName.petalBorder2.Stroke = null;
            yearPetalName.petalNameText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSLight"];
            HudGrid.Children.Add(yearPetalName);

            PetalControl monthPetalName = new PetalControl(radius - 10, 9, 20, 20, "month");
            monthPetalName.petalBackground.Stroke = null;
            monthPetalName.petalBorder1.Stroke = null;
            monthPetalName.petalBorder2.Stroke = null;
            monthPetalName.petalNameText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSLight"];
            HudGrid.Children.Add(monthPetalName);

            PetalControl dayPetalName = new PetalControl(radius - 10, 189, 20, 20, "day");
            dayPetalName.petalBackground.Stroke = null;
            dayPetalName.petalBorder1.Stroke = null;
            dayPetalName.petalBorder2.Stroke = null;
            dayPetalName.petalNameText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSLight"];
            HudGrid.Children.Add(dayPetalName);


            //Draw years 
            currentYear = Date.Year;
            DrawYears();
            
            CreateMonth();
            CreateDays();
        }

        private void DrawYears()
        {
            yearPetal = new PetalControl(radius - 10, -1, 20, 20, currentYear.ToString());
            yearPetal.petalBackground.Stroke = null;
            yearPetal.petalBorder1.Stroke = null;
            yearPetal.petalBorder2.Stroke = null;
            yearPetal.petalNameText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];

            HudGrid.Children.Add(yearPetal);
        }

        private void CreateMonth()
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

                monthPetals[i] = new PetalControl(Gold.radius - 10, 22 + i *  14, currentMonthName.Length * 2,  15 , currentMonthName);
                monthPetals[i].petalBackground.Stroke = null;
                monthPetals[i].petalBorder1.Stroke = null;
                monthPetals[i].petalBorder2.Stroke = null;
                monthPetals[i].petalNameText.Foreground = null;
                HudGrid.Children.Add(monthPetals[i]);                
            }

            Path MonthPath = new Path();
            MonthPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - 17 , 30, 195);
            MonthPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
            HudGrid.Children.Add(MonthPath);

        }

        private void CreateDays()
        {
            for (int i = 0; i < 31; i++)
            {
                dayPetals[i] = new PetalControl(Gold.radius - 10, 195  + i * 5, 7, 5, (i + 1).ToString());
                dayPetals[i].petalBackground.Stroke = null;
                dayPetals[i].petalBorder1.Stroke = null;
                dayPetals[i].petalBorder2.Stroke = null;
                dayPetals[i].petalNameText.Foreground = null;
                HudGrid.Children.Add(dayPetals[i]);
            }

            Path dayPath = new Path();
            dayPath.Data = HudLibrary.DrawArc(Gold.center, Gold.center, Gold.radius - 10 - 7, 206, 359);
            dayPath.Stroke = (SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha2"];
            HudGrid.Children.Add(dayPath);

        }

        public void SetDate(DateTime Date)
        {
            if (Date.Year != currentYear)
            {
                currentYear = Date.Year;
                HudGrid.Children.Remove(yearPetal);
                DrawYears();
            }

            if (Date.Month != currentMonth)
            {
                //check if month petal path text is ready
                if (monthPetals[0].pathText == null)
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
                        monthPetals[i].pathText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                    }
                    else
                    {
                        currentMonthColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
                        if (currentMonth > (i + 1))
                        {
                            currentMonthColor.A -= (byte)((currentMonth - i) * hideStep);
                            monthPetals[i].pathText.Foreground = new SolidColorBrush(currentMonthColor);
                        }
                        else
                        {
                            currentMonthColor.A -= (byte)((i - currentMonth) * hideStep);
                            monthPetals[i].pathText.Foreground = new SolidColorBrush(currentMonthColor);
                        }
                    }
                }
            }

            if (Date.Day != currentDay)
            {
                //check if day petal path text is ready
                if (dayPetals[0].pathText == null)
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
                        dayPetals[i].pathText.Foreground = (SolidColorBrush)App.Current.Resources["OWLOSWarning"];
                    }
                    else
                    {
                        currentDayColor = (App.Current.Resources["OWLOSPrimary"] as SolidColorBrush).Color;
                        if (currentDay > (i + 1))
                        {
                            currentDayColor.A -= (byte)((currentDay - i) * hideStep);
                            dayPetals[i].pathText.Foreground = new SolidColorBrush(currentDayColor);
                        }
                        else
                        {
                            currentDayColor.A -= (byte)((i - currentDay) * hideStep);
                            dayPetals[i].pathText.Foreground = new SolidColorBrush(currentDayColor);
                        }
                    }
                }
            }
        }
    }
}
